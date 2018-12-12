package main

import (
	"encoding/json"
	"io/ioutil"
	"net/http"
)

// GetJson - retrive http get response as json
func GetJson(url string, target interface{}) error {
	resp, getErr := http.DefaultClient.Get(url)
	if getErr != nil {
		return getErr
	}
	body, readErr := ioutil.ReadAll(resp.Body)
	if readErr != nil {
		return readErr
	}
	if parseErr := json.Unmarshal(body, target); parseErr != nil {
		return parseErr
	}

	return nil
}
