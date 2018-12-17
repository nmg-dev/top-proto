package main

import (
	"database/sql"
	"encoding/json"
	"errors"
	"fmt"
	"io/ioutil"
	"net/http"
	"strconv"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
)

// User - user info
type User struct {
	ID uint `json:"id" db:"id"`

	GUID  string `json:"guid" db:"gid"`
	Email string `json:"email"`

	Expire    float64 `json:"expires_at"`
	CanAdmin  bool    `json:"can_admin" db:"can_admin"`
	CanManage bool    `json:"can_manage" db:"can_manage"`

	Profile DJsonMap `json:"profile" db:"profile"`
	Access  DJsonMap `db:"access"`
	Token   string   `json:"token"`

	CreatedAt time.Time `db:"created_at"`
	UpdatedAt time.Time `db:"updated_at"`
	DeletedAt time.Time `db:"deleted_at"`
	BlockedAt time.Time `db:"blocked_at"`

	IsInternal bool
}

const userInsertStmt = `INSERT IGNORE INTO users (gid,access,profile,can_admin,can_input,created_at,updated_at) VALUES (?,?,?,?,?,NOW(),NOW())`
const userUpdateStmt = `UPDATE users SET access=?, profile=?, can_admin=?, can_input=?, updated_at=NOW() WHERE id=?`
const userDeleteStmt = `UPDATE users SET deleted_at=NOW() WHERE id=?`
const userBlockStmt = `UPDATE users SET blocked_at=NOW() WHERE id=?`
const userSearchByEmail = `SELECT * FROM users WHERE profile->"$.email"=? ORDER BY ID DESC LIMIT 1`
const userConditionAvailable = `deleted_at is NULL AND blocked_at is NULL`

func (u *User) insertStatement(db *sql.DB) *sql.Stmt {
	return QueriableState(db, userInsertStmt)
}

func (u *User) insertExecution(stmt *sql.Stmt) (sql.Result, error) {
	access, _ := json.Marshal(u.Access)
	profile, _ := json.Marshal(u.Profile)
	return stmt.Exec(
		u.GUID,
		access,
		profile,
		u.CanAdmin,
		u.CanManage,
	)
}

func (u User) updateStatement(db *sql.DB) *sql.Stmt {
	return QueriableState(db, userUpdateStmt)
}

func (u User) updateExecution(stmt *sql.Stmt) (sql.Result, error) {
	access, _ := json.Marshal(u.Access)
	profile, _ := json.Marshal(u.Profile)
	return stmt.Exec(access, profile, u.CanAdmin, u.CanManage, u.ID)
}

func (u User) deleteStatement(db *sql.DB) *sql.Stmt {
	return QueriableState(db, userDeleteStmt)
}

func (u User) deleteExecution(stmt *sql.Stmt) (sql.Result, error) {
	return stmt.Exec(u.ID)
}

// Insert - Queriable impl.
func (u *User) Insert(db *sql.DB) error {
	if u.ID <= 0 {
		lastID, err := ExecuteQueriableInsert(u, db, u.insertStatement, u.insertExecution)
		u.ID = uint(lastID)
		return err
	}
	return nil
}

// Update - Queriable impl.
func (u User) Update(db *sql.DB) error {
	if 0 < u.ID {
		return ExecuteQueriableUpdate(u, db, u.updateStatement, u.updateExecution)
	} else {
		return u.Insert(db)
	}
}

// Delete - Queriable impl.
func (u User) Delete(db *sql.DB) error {
	if 0 < u.ID {
		return ExecuteQueriableUpdate(u, db, u.deleteStatement, u.deleteExecution)
	}
	return nil
}

// Bind - Queriable impl.
func (u *User) Bind(row Scannable) error {
	var accessJson, profileJson string
	var deletedAt, blockedAt interface{}
	err := row.Scan(
		&u.ID,
		&u.GUID,
		&accessJson,
		&profileJson,
		&u.CanAdmin,
		&u.CanManage,
		&u.CreatedAt,
		&u.UpdatedAt,
		&deletedAt,
		&blockedAt,
	)
	json.Unmarshal([]byte(accessJson), &u.Access)
	json.Unmarshal([]byte(profileJson), &u.Profile)

	u.Email = u.Profile["email"].(string)
	u.Expire = u.Access["expires_at"].(float64)
	u.Token = u.Access["token"].(string)

	if deletedAt != nil {
		u.DeletedAt = deletedAt.(time.Time)
	}
	if blockedAt != nil {
		u.BlockedAt = blockedAt.(time.Time)
	}

	return err
}

func (u *User) Find(db *sql.DB, id uint) error {
	stmt, _ := db.Prepare(`SELECT * FROM users WHERE id=?`)
	defer stmt.Close()
	return u.Bind(stmt.QueryRow(id))
}

// SearchEmail -
func (u *User) SearchEmail(db *sql.DB) error {
	stmt, _ := db.Prepare(userSearchByEmail)
	rs := stmt.QueryRow(u.Email)
	defer stmt.Close()

	if rs == nil {
		return errors.New("Not Found")
	}
	return u.Bind(rs)
}

func (u User) IsDeleted() bool {
	return 0 < u.DeletedAt.Unix() && u.DeletedAt.Before(time.Now())
}

func (u User) IsBlocked() bool {
	return 0 < u.BlockedAt.Unix() && u.BlockedAt.Before(time.Now())
}

// String
func (u User) String() string {
	return fmt.Sprintf(
		`User[%d] %s %s\n\t ADMIN(%t) MANAGER(%t)`,
		u.ID,
		u.Profile["email"].(string),
		u.Access["token"].(string),
		u.CanAdmin,
		u.CanManage,
	)
}

const googleAuth = `https://www.googleapis.com/oauth2/v3/tokeninfo`
const googleAppId = `812043764419-lunbnv3g64rg709da2ad6asnqg05c7oi.apps.googleusercontent.com`
const googleIss = `accounts.google.com`
const googleVerifiedEmail = `true`

const hostDomain = `nextmediagroup.co.kr,`

const selectUserEmail = `SELECT * FROM user WHERE profile->"$.email" = ?`

// PostOpen - start open
func PostOpenAuth(ctx *gin.Context) {
	var theUser User
	ins, err := ioutil.ReadAll(ctx.Request.Body)
	if err != nil {
		ctx.JSON(http.StatusNotAcceptable, gin.H{
			"e": err.Error(),
		})
	}
	fmt.Println(string(ins))
	json.Unmarshal(ins, &theUser)

	verr := theUser.validateGoogleToken()
	if verr != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{
			"e": verr.Error(),
		})
		return
	}

	// database check for existing user
	db := getDatabase(ctx)
	theUser.SearchEmail(db)
	if theUser.ID <= 0 {
		theUser.CanAdmin = false
		theUser.CanManage = theUser.IsInternal
		theUser.Insert(db)
	} else if theUser.IsBlocked() {
		ctx.JSON(http.StatusInternalServerError, gin.H{"e": theUser.BlockedAt})
		return
	} else if theUser.IsDeleted() {
		ctx.JSON(http.StatusForbidden, gin.H{"e": theUser.DeletedAt})
		return
	} else {
		theUser.Update(db)
	}

	// response back
	ctx.JSON(http.StatusOK, theUser)
}

// GetUserCacheKey
func GetUserCacheKey(token string) string {
	return fmt.Sprintf("to://user/%s", token)
}

// RequireLoginSetMiddle - when only login session required
func RequireLoginSetMiddle(ctx *gin.Context) {
	if statusCode := authInMiddle(ctx, false, false); statusCode != http.StatusOK {
		ctx.AbortWithStatusJSON(statusCode, gin.H{"e": "login required"})
	}
}

// RequireManagerSetMiddle - when manager auth required
func RequireManagerSetMiddle(ctx *gin.Context) {
	if statusCode := authInMiddle(ctx, true, false); statusCode != http.StatusOK {
		ctx.AbortWithStatusJSON(statusCode, gin.H{"e": "manager authentication required"})
	}
}

// RequireAdminSetMiddle - when admin auth required
func RequireAdminSetMiddle(ctx *gin.Context) {
	if statusCode := authInMiddle(ctx, false, true); statusCode != http.StatusOK {
		ctx.AbortWithStatusJSON(statusCode, gin.H{"e": "admin authentication required"})
	}
}

func authInMiddle(ctx *gin.Context, needManager bool, needAdmin bool) int {
	if token, ok := ctx.GetQuery("token"); ok {
		db := getDatabase(ctx)
		stmt, _ := db.Prepare(`SELECT * FROM users WHERE access->"$.token"=? ORDER BY updated_at DESC LIMIT 1`)

		var theUser User
		rs := stmt.QueryRow(token)
		theUser.Bind(rs)

		if needAdmin && !theUser.CanAdmin {
			return http.StatusForbidden
		} else if needManager && !theUser.CanAdmin && !theUser.CanManage {
			return http.StatusForbidden
		} else {
			return http.StatusOK
		}
	}

	return http.StatusUnauthorized
}

// ValidateGToken - google token validation
func (u *User) validateGoogleToken() error {
	gaUri := fmt.Sprintf("%s?id_token=%s", googleAuth, u.Token)
	fmt.Println(gaUri)
	var gresp map[string]string
	if gerr := GetJson(gaUri, &gresp); gerr == nil {
		vals, _ := json.Marshal(gresp)
		fmt.Println(string(vals))
		if _, ok := gresp["exp"]; !ok {
			return errors.New("no expiration")
		}
		if gmail, ok := gresp["email"]; !ok || strings.Compare(gmail, u.Email) != 0 {
			return fmt.Errorf("email unmatched %s != %s", gmail, u.Email)
		}
		if aud, ok := gresp["aud"]; !ok || strings.Compare(aud, googleAppId) != 0 {
			return fmt.Errorf("appid unmatched %s != %s", aud, googleAppId)
		}
		if iss, ok := gresp["iss"]; !ok || !strings.Contains(iss, googleIss) {
			return fmt.Errorf("api host unmatched %s != %s", iss, googleIss)
		}
		if ve, ok := gresp["email_verified"]; !ok || strings.Compare(ve, googleVerifiedEmail) != 0 {
			return errors.New("email not verified")
		}
		//
		u.Profile = DJsonMap{
			"email":   gresp["email"],
			"name":    gresp["name"],
			"picture": gresp["picture"],
		}

		expires, _ := strconv.ParseFloat(gresp["exp"], 64)
		u.Access = DJsonMap{
			"token":      u.Token,
			"expires_at": expires,
		}

		if hd, ok := gresp["hd"]; ok && strings.Contains(hostDomain, hd+",") {
			u.IsInternal = true
		} else {
			u.IsInternal = false
		}

		return nil
	} else {
		return gerr
	}

}
