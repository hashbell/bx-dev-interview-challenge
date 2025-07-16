import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { UserEntity } from './user.entity';

@Entity('files')
export class FileEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  key: string;

  @Column()
  filename: string;

  @Column()
  size: number;

  @Column()
  mimetype: string;

  @Column()
  uploadedBy: number;

  @CreateDateColumn()
  uploadedAt: Date;

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'uploadedBy' })
  user?: UserEntity;

  constructor(key: string, filename: string, size: number, mimetype: string, uploadedBy: number) {
    this.key = key;
    this.filename = filename;
    this.size = size;
    this.mimetype = mimetype;
    this.uploadedBy = uploadedBy;
  }
} 
