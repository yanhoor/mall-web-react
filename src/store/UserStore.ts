import { makeAutoObservable } from 'mobx'
import $http from '../http'
import urls from '../http/urls'

interface User{
    id: string,
    name: string,
    mobile: string,
    password: string,
    type: number,
    roles: string[]
}

class UserStore{

    constructor() {
        makeAutoObservable(this)
    }

    userInfo: User = {
        id: '',
        name: '',
        mobile: '',
        password: '',
        type: 1,
        roles: []
    }

    async updateUser() {
        return $http.fetch(urls.adminInfo).then(r => {
            if(r.success){
                this.userInfo = r.info
                return true
            }
        })
    }

    async checkAndGetUserInfo(){
        if(!this.userInfo.id){
            return this.updateUser()
        }else{
            return true
        }
    }
}

export default new UserStore()
