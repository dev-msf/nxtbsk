import prisma from '../prisma';

export async function createProduct(data: any) {
  const product = await prisma.product.create({ data });
  await logAudit('CREATE', product.id, product);
  return product;
}

export async function getProductById(id: string) {
  return prisma.product.findFirst({ where: { id, deletedAt: null } });
}

export async function updateProduct(id: string, data: any) {
  const product = await prisma.product.update({ where: { id }, data });
  await logAudit('UPDATE', id, data);
  return product;
}

export async function softDeleteProduct(id: string) {
  const product = await prisma.product.update({ where: { id }, data: { deletedAt: new Date() } });
  await logAudit('SOFT_DELETE', id, product);
  return product;
}

export async function listProducts(cursor?: string, limit: number = 10, search?: string) {
  const where: any = { deletedAt: null };
  if (search) {
    where.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { tags: { has: search } },
    ];
  }
  return prisma.product.findMany({
    where,
    take: limit,
    ...(cursor ? { skip: 1, cursor: { id: cursor } } : {}),
    orderBy: { createdAt: 'asc' },
  });
}

async function logAudit(action: string, productId: string, details: any) {
  await prisma.auditLog.create({ data: { action, productId, details } });
} 