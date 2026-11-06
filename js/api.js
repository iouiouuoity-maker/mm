import {AI_API_URL,isConfigured} from './config.js';
export const configured=isConfigured;
const studentKey='student_session';if(!sessionStorage.getItem(studentKey))sessionStorage.setItem(studentKey,crypto.randomUUID()+'-'+crypto.randomUUID());
export function token(){return sessionStorage.getItem('admin_token')||''}
export async function api(path,{method='GET',body,admin=false}={}){
 if(!configured)throw Error('Сервер ещё не настроен владельцем сайта.');
 const ctrl=new AbortController();const timer=setTimeout(()=>ctrl.abort(),18000);
 try{const response=await fetch(AI_API_URL+'/api'+path,{method,headers:{'Content-Type':'application/json','X-Student-Token':sessionStorage.getItem(studentKey),...(admin?{'Authorization':'Bearer '+token()}:{})},body:body===undefined?undefined:JSON.stringify(body),signal:ctrl.signal});const data=await response.json().catch(()=>({}));if(!response.ok)throw Error(data.error||'Ошибка сервера ('+response.status+')');return data} catch(e){if(e.name==='AbortError')throw Error('Время ожидания сервера истекло.');throw e}finally{clearTimeout(timer)}
}
