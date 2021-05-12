package factory

import (
	"github.com/jinzhu/gorm"
	"github.com/lfhillesheim/imersao-fullstack-fullcycle/tree/main/codepix/application/usecase"
	"github.com/lfhillesheim/imersao-fullstack-fullcycle/tree/main/codepix/infrastructure/repository"
)

func TransactionUseCaseFactory(database *gorm.DB) usecase.TransactionUseCase {
	pixRepository := repository.PixKeyRepositoryDb{Db: database}
	transactionRepository := repository.TransactionRepositoryDb{Db: database}

	transactionUseCase := usecase.TransactionUseCase{
		TransactionRepository: &transactionRepository,
		PixRepository:         pixRepository,
	}

	return transactionUseCase
}
