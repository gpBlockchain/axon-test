package axon_test

import (
	"fmt"
	"github.com/ethereum/go-ethereum/rpc"
	"github.com/stretchr/testify/assert"
	"testing"
)

func TestWeb3ClientVersion(t *testing.T) {
	client, err := rpc.Dial("http://localhost:8000")
	if err != nil {
		fmt.Println("err", err)
	}
	var clientVersion string
	_ = client.Call(&clientVersion, "web3_clientVersion")

	fmt.Println(clientVersion)
	assert.Equal(t, clientVersion, "0.1.0")
}
