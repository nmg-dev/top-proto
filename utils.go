package main

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
	"strings"
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

//WhereInJoin - return 1,2,3,...
func WhereInJoin(ids []uint) string {
	strs := make([]string, len(ids))
	for i, v := range ids {
		strs[i] = fmt.Sprintf("%d", v)
	}

	return strings.Join(strs, ",")
}
