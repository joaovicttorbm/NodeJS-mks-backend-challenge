import { MigrationInterface, QueryRunner } from "typeorm";

export class Default1714245567908 implements MigrationInterface {
    name = 'Default1714245567908'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "films" DROP CONSTRAINT "FK_33d822184e050b3118d0b185f3e"`);
        await queryRunner.query(`ALTER TABLE "films" DROP COLUMN "userId"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "films" ADD "userId" integer`);
        await queryRunner.query(`ALTER TABLE "films" ADD CONSTRAINT "FK_33d822184e050b3118d0b185f3e" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
