const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function seedUser() {
  try {
    // 加密密码
    const hashedPassword = await bcrypt.hash('12345678', 10);

    // 插入用户数据
    const user = await prisma.user.create({
      data: {
        username: 'admin@example.com', // 使用邮箱作为用户名
        password: hashedPassword,
      },
    });

    console.log('用户数据插入成功:', user);
  } catch (error) {
    console.error('插入用户数据失败:', error);
  } finally {
    // 关闭Prisma连接
    await prisma.$disconnect();
  }
}

seedUser();
// 添加标签
async function seedTag(params) {
  try {
    // 插入标签数据
    const tag = await prisma.tag.create({
      data: {
        name: 'Next.js',
      },
    });

    console.log('标签数据插入成功:', tag);
  } catch (error) {
    console.error('插入标签数据失败:', error);
  } finally {
    // 关闭Prisma连接
    await prisma.$disconnect();
  }
}
// seedTag()