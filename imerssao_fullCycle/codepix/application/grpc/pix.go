package grpc

import (
	"context"

	"github.com/lfhillesheim/imersao-fullstack-fullcycle/tree/main/codepix/application/grpc/pb"
	"github.com/lfhillesheim/imersao-fullstack-fullcycle/tree/main/codepix/application/usecase"
)

type PixGrpcService struct {
	PixUseCase usecase.PixUseCase
	pb.UnimplementedPixServiceServer
}

func (p *PixGrpcService) RegisterPixKey(ctx context.Context, in *pb.PixKeyRegistration) (*pb.PixKeyCreatedResult, error) {

	key, err := p.PixUseCase.RegisterKey(in.Key, in.Kind, in.AccountId)
	if err != nil {
		return &pb.PixKeyCreatedResult{
			Status: "not created",
			Error:  err.Error(),
		}, err
	}

	return &pb.PixKeyCreatedResult{
		Id:     key.ID,
		Status: "created",
	}, nil
}

func (p *PixGrpcService) Find(ctx context.Context, in *pb.PixKey) (*pb.PixKeyInfo, error) {
	pixkey, err := p.PixUseCase.FindKey(in.Key, in.Kind)
	if err != nil {
		return &pb.PixKeyInfo{}, err
	}

	return &pb.PixKeyInfo{
		Id:   pixkey.ID,
		Kind: pixkey.Kind,
		Key:  pixkey.Key,
		Account: &pb.Account{
			AccountId:     pixkey.AccountID,
			AccountNumber: pixkey.Account.Number,
			BankId:        pixkey.Account.BankID,
			BankName:      pixkey.Account.Bank.Name,
			OwnerName:     pixkey.Account.OwnerName,
			CreatedAt:     pixkey.Account.CreatedAt.String(),
		},
		CreatedAt: pixkey.CreatedAt.String(),
	}, nil
}

func NewPixGrpcService(usecase usecase.PixUseCase) *PixGrpcService {
	return &PixGrpcService{
		PixUseCase: usecase,
	}
}
