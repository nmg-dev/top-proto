package main

import (
	"fmt"
	"os"
	"testing"
)

func TestFileContentRead(t *testing.T) {
	folder := `./samples`
	fileinfo, ferr := os.Stat(`./samples/TO1901_jhlee_190221.tsv`)
	if ferr != nil {
		t.Fatal(ferr)
	}

	rows, readerr := readFileContent(folder, fileinfo, false)
	if readerr != nil {
		t.Fatal(readerr)
	} else if len(rows) <= 0 {
		t.Fatalf("file read none")
	}
	for rn, row := range rows {
		t.Logf("%d: %s", rn, row)
		fmt.Printf("%d: %s", rn, row)
		if rn > 30 {
			break
		}
	}
}

func TestFileContentTags(t *testing.T) {

}
