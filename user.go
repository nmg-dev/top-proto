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

func (u User) Saved() bool {
	return 0 < u.ID
}

// Insert - Queriable impl.
func (u *User) Insert(db *sql.DB) error {
	if u.ID <= 0 {
		stmt, _ := db.Prepare(userInsertStmt)
		access, _ := json.Marshal(u.Access)
		profile, _ := json.Marshal(u.Profile)
		rs, err := stmt.Exec(
			u.GUID,
			access,
			profile,
			u.CanAdmin,
			u.CanManage,
		)
		defer stmt.Close()

		lastID, _ := rs.LastInsertId()
		u.ID = uint(lastID)

		fmt.Printf("%d\n", u.ID)

		return err
	}
	return nil
}

// Update - Queriable impl.
func (u User) Update(db *sql.DB) error {
	if 0 < u.ID {
		stmt, _ := db.Prepare(userUpdateStmt)
		access, _ := json.Marshal(u.Access)
		profile, _ := json.Marshal(u.Profile)

		_, err := stmt.Exec(access, profile, u.CanAdmin, u.CanManage, u.ID)
		defer stmt.Close()

		return err
	} else {
		return u.Insert(db)
	}
}

// Delete - Queriable impl.
func (u User) Delete(db *sql.DB) error {
	if 0 < u.ID {
		stmt, _ := db.Prepare(userDeleteStmt)
		stmt.Exec(u.ID)
		defer stmt.Close()
	}
	return nil
}

// Bind - Queriable impl.
func (u *User) Bind(row *sql.Row) error {
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
	stmt, _ = db.Prepare(`SELECT * FROM users WHERE id=?`)
	return u.Bind(stmt.QueryRow(id))
}

// SearchEmail -
func (u *User) SearchEmail(db *sql.DB) error {
	stmt, _ := db.Prepare(userSearchByEmail)
	rs := stmt.QueryRow(u.Email)
	if rs == nil {
		return errors.New("Not Found")
	}
	return u.Bind(rs)
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

// PostOpen - start open
const selectUserEmail = `select * from user where json_extract(profile, $.email)=?`

func PostOpen(ctx *gin.Context) {
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
	if !theUser.Saved() {
		theUser.CanAdmin = false
		theUser.CanManage = theUser.IsInternal
		theUser.Insert(db)
	} else {
		theUser.Update(db)
	}

	// response back
	ctx.JSON(http.StatusOK, theUser)
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