// migrations/1763126904480-CreateAttractionImageTable.ts
import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateAttractionImageTable1763126904480 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({
            name: "attraction_image",
            columns: [
                {
                    name: "id",
                    type: "int",
                    isPrimary: true,
                    isGenerated: true,
                    generationStrategy: "increment"
                },
                {
                    name: "region",
                    type: "varchar",
                    length: "255",
                    isNullable: false
                },
                {
                    name: "name", 
                    type: "varchar",
                    length: "255",
                    isNullable: false
                },
                {
                    name: "size",
                    type: "varchar",
                    length: "255",
                    isNullable: false
                },
                {
                    name: "path",
                    type: "varchar",
                    length: "500",
                    isNullable: false
                },
                {
                    name: "created_at",
                    type: "timestamp",
                    default: "CURRENT_TIMESTAMP"
                }
            ]
        }), true);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("attraction_image");
    }
}