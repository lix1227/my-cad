export const userStatus = (state,user) =>{
  if(user){
    state.currentUser = user;
    state.isLogin = true;
  }else if(user == null){
    // 等出时清空sessionStorage里的东西
    sessionStorage.setItem("userName",null);
    sessionStorage.setItem("userToken",'');
    state.currentUser = null;
    state.isLogin = false;
    state.token = '';
  }
}
