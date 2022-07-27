package axon_test

import (
	"fmt"
	"github.com/ethereum/go-ethereum/rpc"
	"testing"
)

func TestEthProtocolVersion(t *testing.T) {
	client, err := rpc.Dial("http://localhost:8000")
	if err != nil {
		fmt.Println("err", err)
	}
	var protocolVersion string
	_ = client.Call(&protocolVersion, "eth_protocolVersion")
	fmt.Println(protocolVersion)
}
