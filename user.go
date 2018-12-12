package main

import (
	"encoding/json"
	"errors"
	"fmt"
	"io/ioutil"
	"net/http"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
)

// User - user info
type User struct {
	IdentEntity

	GUID  string `json:"guid" db:"gid"`
	Email string `json:"email"`

	Expire    uint64 `json:"expires_at"`
	CanAdmin  bool   `json:"can_admin" db:"can_admin"`
	CanManage bool   `json:"can_manage db:"can_manage"`

	Profile DJsonMap `json:"profile" db:"profile"`
	Access  DJsonMap `db:"access"`
	Token   string   `json:"token"`

	CreatedAt time.Time `db:"created_at"`
	UpdatedAt time.Time `db:"updated_at"`
	BlockedAt time.Time `db:"blocked_at"`

	IsInternal bool
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
	theUser.Find(ctx, selectUserEmail, theUser.GUID, theUser.Email)
	if theUser.ID <= 0 {
		// create new user
	}

	// user check
	theUser.CanAdmin = theUser.IsInternal
	theUser.CanManage = false

	// create or

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

		u.Access = DJsonMap{
			"token":      u.Token,
			"expires_at": gresp["exp"],
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
