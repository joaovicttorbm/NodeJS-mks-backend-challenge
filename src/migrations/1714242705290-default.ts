import { MigrationInterface, QueryRunner } from "typeorm";

export class Default1714242705290 implements MigrationInterface {
    name = 'Default1714242705290'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "films" ADD CONSTRAINT "UQ_ef6e0245decf772d1dd66f158ae" UNIQUE ("title")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "films" DROP CONSTRAINT "UQ_ef6e0245decf772d1dd66f158ae"`);
    }

}
