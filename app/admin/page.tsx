import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

async function Admin() {
  // 获取cookie中的token
  const token = (await cookies()).get('token')?.value;

  // 如果有token，跳转到admin/home
  if (token) {
    redirect('/admin/home');
  }

  // 如果没有token，跳转到admin/login
  redirect('/admin/login');
}

export default Admin;