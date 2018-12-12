package main

// Attribution - attribute keys
type Attribution struct {
	IdentEntity

	Class string   `json:"class"`
	Label string   `json:"label"`
	Name  string   `json:"name"`
	Props DJsonMap `json:"properties"`

	LoggedEntity
}
