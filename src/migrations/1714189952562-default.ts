import { MigrationInterface, QueryRunner } from "typeorm";

export class Default1714189952562 implements MigrationInterface {
    name = 'Default1714189952562'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "films" ("id" SERIAL NOT NULL, "title" text NOT NULL, "description" text NOT NULL, "userId" integer, CONSTRAINT "PK_697487ada088902377482c970d1" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "users" ("id" SERIAL NOT NULL, "name" text NOT NULL, "email" text NOT NULL, "password" text NOT NULL, CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "films" ADD CONSTRAINT "FK_33d822184e050b3118d0b185f3e" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "films" DROP CONSTRAINT "FK_33d822184e050b3118d0b185f3e"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TABLE "films"`);
    }

}
