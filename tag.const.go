package main

type AttributionCls struct {
	Class string
	Label string
}

var attributionClasses = []AttributionCls{
	// about AD, campaign
	AttributionCls{"campaign", "Campaign"},
	AttributionCls{"agency", "Agency"},
	AttributionCls{"creative", "Ad Creative"},

	// about Channel
	AttributionCls{"channel", "Channel"},
	AttributionCls{"adproduct", "Ad Product"},

	// about product
	AttributionCls{"account", "Account"},
	AttributionCls{"brand", "Brand"},
	AttributionCls{"product", "Product"},
	AttributionCls{"category", "Product Category"},
}

//ListAttrClasses
func ListAttrClasses() []AttributionCls {
	return attributionClasses
}

//
