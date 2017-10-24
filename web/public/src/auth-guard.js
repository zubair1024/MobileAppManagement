export class AuthGuard {
    constructor(){
        console.log('auth guard const');
    }
    activate() {
        console.info('auth guard was called');
        let active;
        if (localStorage.getItem('currentUser')) {
            console.warn('user is logged in');

        } else {
            console.log('user is not logged in');
        }
    }
}