package main

import (
	"database/sql"
	"time"
)

// CampaignMeta - campaign meta data
type CampaignMeta struct {
	ID uint `json:"id" db:"id"`

	Attr     Attribution
	Campaign Campaign

	AttributeID uint `db:"attr_id"`

	CreatedAt time.Time `json:"created_at" db:"created_at"`
	CreatedBy uint      `json:"created_by" db:"created_by"`
	UpdatedAt time.Time `json:"updated_at" db:"updated_at"`
	UpdatedBy uint      `json:"updated_by" db:"updated_by"`
	DeletedAt time.Time `json:"deleted_at" db:"deleted_at"`
	DeletedBy uint      `json:"deleted_by" db:"deleted_by"`
}

// Campaign - campaign data
type Campaign struct {
	ID uint `json:"id" db:"id"`

	Title string `json:"title" db:"title"`
	Memo  string `json:"memo" db:"memo"`

	CreatedAt time.Time `json:"created_at" db:"created_at"`
	CreatedBy uint      `json:"created_by" db:"created_by"`
	UpdatedAt time.Time `json:"updated_at" db:"updated_at"`
	UpdatedBy uint      `json:"updated_by" db:"updated_by"`
	DeletedAt time.Time `json:"deleted_at" db:"deleted_at"`
	DeletedBy uint      `json:"deleted_by" db:"deleted_by"`
}

const campaignInsertStmt = `INSERT INTO campaigns (title, memo, created_at, created_by, updated_at, updated_by) VALUES (?, ?, NOW(), ?, NOW(), ?)`
const campaignUpdateStmt = `UPDATE campaigns SET title=?, memo=?, updated_at=NOW(), updated_by=? WHERE id=?`
const campaignDeleteStmt = `UPDATE campaigns SET deleted_at=NOW(), deleted_by=? WHERE id=?`

// Insert -
func (c *Campaign) Insert(db *sql.DB) error {
	return nil
}

// CampaignPerformance
type CampaignPerformance struct {
	ID         uint64    `json:"id" db:"id"`
	DayID      time.Time `json:"day_id" db:"day_id"`
	CampaignID uint      `db:"campaign_id"`

	Impression uint `json:"impression" db:"impression"`
	Click      uint `json:"click" db:"click"`
	Conversion uint `json:"conversion" db:"conversion"`
	Cost       uint `json:"cost" db:"cost"`

	CreatedAt time.Time `json:"created_at" db:"created_at"`
	CreatedBy uint      `json:"created_by" db:"created_by"`
	UpdatedAt time.Time `json:"updated_at" db:"updated_at"`
	UpdatedBy uint      `json:"updated_by" db:"updated_by"`
}

const performanceInsertStmt = `INSERT INTO campaign_performances (day_id, campaign_id, impression, click, conversion, cost)`
const performancePeriods = `SELECT * FROM campaign_performances WHERE ? <= day_id AND day_id < ?`

func (p *CampaignPerformance) Insert(db *sql.DB) error {
	return nil
}

type CampaignResp struct {
	Cmps map[uint]Campaign              `json:"campaigns"`
	Atts map[uint]Campaign              `json:"attributions"`
	Meta map[uint][]uint                `json:"map"` // Meta[11] = [2, 3, 4] campaign(11) holds attribution(2), (3), (4)
	Recs map[uint][]CampaignPerformance `json:"records"`
}

func SearchQuery(from time.Time, till time.Time) *CampaignResp {

}
