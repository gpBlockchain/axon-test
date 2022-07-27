package axon

import (
	"fmt"

	"github.com/ethereum/go-ethereum/rpc"
)

var url = "http://localhost:8000"
var axon = "http://18.162.235.225:8000/"

func axonClient(axon_url string) *rpc.Client {
	client, err := rpc.Dial(axon_url)
	if err != nil {
		fmt.Println("err", err)
	}
	return client
}
