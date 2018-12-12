package main

type CampaignMeta struct {
	IdentEntity

	Attr     Attribution
	Campaign Campaign

	LoggedEntity
}

// Campaign - campaign data
type Campaign struct {
	IdentEntity

	Title string `json:"title" db:"title"`
	Memo  string `json:"memo" db:"memo"`

	Attrs []CampaignMeta `json:"attrs"`

	LoggedEntity
}
