import {Entity, Column, ManyToOne, JoinColumn, PrimaryGeneratedColumn, OneToMany} from 'typeorm';
import Jogador from './Jogador';
import Round from './Round';

@Entity('tb_partida')
class Partida {

    @PrimaryGeneratedColumn()
    id: number;

    @Column('date', {nullable: true})
    fim: Date;
    
    @Column('date', {default: () => 'CURRENT_TIMESTAMP'})
    inicio: Date;

    @ManyToOne(type => Jogador)
    @JoinColumn({name: "jogador_nickname", referencedColumnName: "nickname"})
    jogador: Jogador;  

    @OneToMany( () => Round, r => r.partida)
    rounds: Round[];
}
export default Partida;