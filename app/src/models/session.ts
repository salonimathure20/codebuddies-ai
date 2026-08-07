export interface ISession {
  _id?: string;
  coderId: string;
  proctorId: string;
  videoUrl?: string;
  code?: string;
  allottedTime: string;
  language: string;
  status?: string;
  date?: any;
}
