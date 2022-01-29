import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm'

export class CreateDealEvents1643496848209 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(new Table({
      name: 'deal_events',
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
          name: 'deal_id',
          type: 'uuid',
          isNullable: false,
        },
        {
          name: 'active',
          type: 'boolean',
          default: true
        },
        {
          name: 'value',
          type: 'varchar',
          isNullable: false,
        },
        {
          name: 'created_at',
          type: 'timestamp',
          default: 'CURRENT_TIMESTAMP(6)'
        },
        {
          name: 'metadata',
          type: 'json',
          isNullable: true
        }
      ]
    }), true)
    
    await queryRunner.createForeignKey('deal_events', new TableForeignKey({
      columnNames: ['deal_id'],
      referencedColumnNames: ['id'],
      referencedTableName: 'deals',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    }))
  }
    
  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('deal_events')
  }

}
