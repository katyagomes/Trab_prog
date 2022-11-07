import {Entity, Column, ManyToOne, JoinColumn, PrimaryGeneratedColumn, ManyToMany, JoinTable} from 'typeorm';
import Partida from './Partida';
import Objetivo from './Objetivo';
// import Modo from '../models/Modo';

@Entity('tb_round')
class Round {

    @PrimaryGeneratedColumn()
    id: number;

    @Column("varchar", { length: 2 })
    numero: number;

    @Column('date', {nullable: true})
    fim: Date;
    
    @Column('date', {default: () => 'CURRENT_TIMESTAMP'})
    inicio: Date;

    
    
    @ManyToOne(type => Partida)
    @JoinColumn({name: "partida_id", referencedColumnName: "id"})
    partida: Partida;   

    @ManyToMany(() => Objetivo)
    @JoinTable({name : "tb_round_objetivo", joinColumn: {name:"round_id", referencedColumnName: "id"}, inverseJoinColumn: {name: "objetivo_id", referencedColumnName: "id"}})
    objetivos: Objetivo[];

}
export default Round;