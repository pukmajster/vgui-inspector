export const kvExample = `
"Resource/UI/FoundPublicGames.res"
{

	"GplGames"
	{
		"ControlName"			"GenericPanelList"
		"fieldName"				"GplGames"
		"xpos"					"c-320"		[$WIN32]
		"ypos"					"110"		[$WIN32]
		"zpos"					"0"
		"wide"					"400"		[$WIN32]
		"tall"					"217"		[$WIN32]
		"xpos"					"45"		[$X360 && $X360WIDE]
		"xpos"					"20"		[$X360 && !$X360WIDE]
		"ypos"					"124"		[$X360]
		"wide"					"440"		[$X360 && $X360WIDE]
		"wide"					"405"		[$X360 && !$X360WIDE]
		"tall"					"170"		[$X360]
		"autoResize"			"1"
		"pinCorner"				"0"

		"panelBorder"			"2" [$WIN32]
		"navRight"				"BtnJoinSelected" [$WIN32]
		"navDown"				"BtnFilters" [$WIN32]
		"navUp"					"BtnCancel" [$WIN32]
	}


	"ImgBackground" [$WIN32]
	{
		"ControlName"			"L4DMenuBackground"
		"fieldName"				"ImgBackground"
		"xpos"					"0"
		"ypos"					"94"
		"zpos"					"-1"
		"wide"					"f0"
		"tall"					"312"
		"autoResize"			"0"
		"pinCorner"				"0"
		"visible"				"1"
		"enabled"				"1"
		"tabPosition"			"0"
		"fillColor"				"0 0 0 0"
	}

}
`