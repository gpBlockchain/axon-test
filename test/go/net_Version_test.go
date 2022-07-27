package axon_test

import (
	"fmt"
	"github.com/ethereum/go-ethereum/rpc"
	"github.com/stretchr/testify/assert"
	"testing"
)

func TestNetVersion(t *testing.T) {
	client, err := rpc.Dial("http://localhost:8000")
	if err != nil {
		fmt.Println("err", err)
	}
	var version string

	_ = client.Call(&version, "net_version")
	assert.Equal(t, version, "0x5")
}
