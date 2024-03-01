export class UserModel{

    constructor(
        public id: number,
        public firstName: string,
        public lastName: string,
        public province: string,
        public email: string,        
        public role: string,
        public birthday: Date | null,
        public token: string    
    ){}
}