import { MigrationInterface, QueryRunner, Table, TableForeignKey  } from 'typeorm'

export class CreateDeals1643415344065 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(new Table({
      name: 'deals',
      columns: [
        {
          name: 'id',
          type: 'uuid',
          isPrimary: true,
          generationStrategy: 'uuid',
          default: 'uuid_generate_v4()',
          isNullable: false,
        },
        {
          name: 'advertising_id',
          type: 'uuid',
          isNullable: false,
        },
        {
          name: 'active',
          type: 'boolean',
          default: true
        },
        {
          name: 'finished',
          type: 'boolean',
          isNullable: false,
          default: false
        },
        {
          name: 'cancelled',
          type: 'boolean',
          isNullable: false,
          default: false
        },
        {
          name: 'created_at',
          type: 'timestamp',
          default: 'CURRENT_TIMESTAMP(6)'
        },
        {
          name: 'buyer_id',
          type: 'uuid',
          isNullable: false,
        },
        {
          name: 'seller_id',
          type: 'uuid',
          isNullable: false
        }
      ]
    }), true)

    await queryRunner.createForeignKey('deals', new TableForeignKey({
      columnNames: ['advertising_id'],
      referencedColumnNames: ['id'],
      referencedTableName: 'advertisings',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    }))

    await queryRunner.createForeignKey('deals', new TableForeignKey({
      columnNames: ['buyer_id'],
      referencedColumnNames: ['id'],
      referencedTableName: 'merchants',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    }))

    await queryRunner.createForeignKey('deals', new TableForeignKey({
      columnNames: ['seller_id'],
      referencedColumnNames: ['id'],
      referencedTableName: 'merchants',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    }))
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('deals')
  }
}
