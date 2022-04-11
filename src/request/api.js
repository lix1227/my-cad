import axios from './$axios'
import base from './base'


/*
* 用户信息api
*/
const user_base_url = `${base.url}/users`
// 获取用户名信息
export const getUserInfo = (username)=>{
  return axios.get(`${user_base_url}/userinfo/?username=${username}`)
}

// 验证用户名唯一性
export const vailteAccount = (username) =>{
  return axios.post(`${user_base_url}/vailtAccount`,{
    username
  })
}

// 登录验证用户信息
export const loginVailte = (username,password) =>{
  return axios.post(`${user_base_url}/logInfo`,{
    username,
    password
  })
}

//用户注册
export const sumbit = (param) =>{
  return axios.post(`${user_base_url}/regInfo`,{
    ...param
  })
}

//用户信息修改
export const updateInfo = (param) =>{
  return axios.post(`${user_base_url}/updateInfo`,{
    ...param
  })
}



/*
* 项目信息api
*/
const project_base_url = `${base.url}/project`
// 验证项目名唯一
export const valiteProName = (param) =>{
  return axios.post(`${project_base_url}/valitProname`,{
    ...param
  })
}

// 提交创建项目信息
export const createPro = (param) =>{
  return axios.post(`${project_base_url}/submitProInfo`,{
    ...param
  })
}

// 获取项目列表
export const getProList = (username) =>{
  return axios.post(`${project_base_url}/getProList`,{
    username
  })
}

// 删除指定项目
export const deletePro = (pid) =>{
  return axios.post(`${project_base_url}/deletePro`,{
    pid
  })
}

// 获取指定项目信息
export const getProInfo = (pid,username) =>{
  return axios.get(`${project_base_url}/getProInfo/?pid=${pid}&username=${username}`)
}
