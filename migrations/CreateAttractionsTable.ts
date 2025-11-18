// migrations/CreateAttractionsTable.ts
import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateAttractionsTable implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({
            name: "attractions",
            columns: [
                {
                    name: "id",
                    type: "int",
                    isPrimary: true,
                    isGenerated: true,
                    generationStrategy: "increment"
                },
                {
                    name: "region_id",
                    type: "int",
                    isNullable: false
                },
                {
                    name: "region_code",
                    type: "varchar",
                    length: "10",
                    isNullable: false
                },
                {
                    name: "image_desktop",
                    type: "varchar",
                    length: "500",
                    isNullable: false
                },
                {
                    name: "image_mobile",
                    type: "varchar",
                    length: "500",
                    isNullable: false
                },
                {
                    name: "name",
                    type: "varchar",
                    length: "255",
                    isNullable: false
                },
                {
                    name: "description",
                    type: "text",
                    default: "''"
                },
                {
                    name: "created_at",
                    type: "timestamp",
                    default: "CURRENT_TIMESTAMP"
                }
            ],
            indices: [
                {
                    name: "IDX_ATTRACTION_REGION",
                    columnNames: ["region_code"]
                },
                {
                    name: "IDX_ATTRACTION_REGION_ID", 
                    columnNames: ["region_id"]
                }
            ]
        }), true);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("attractions");
    }
}