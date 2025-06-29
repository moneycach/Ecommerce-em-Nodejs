const { Router } = require('express');
const { Clerk } = require('@clerk/clerk-sdk-node');
const { pool } = require('@evershop/evershop/src/lib/postgres/connection');
const { insert, select } = require('@evershop/evershop/src/lib/postgres/query');
const { v4: uuidv4 } = require('uuid');

const router = Router();

// Inicializar o cliente Clerk
const clerk = Clerk({ apiKey: process.env.CLERK_SECRET_KEY });

// Endpoint para autenticação
router.post('/api/clerk/auth', async (req, res) => {
  try {
    const { token } = req.body;
    
    if (!token) {
      return res.status(400).json({ error: 'Token não fornecido' });
    }

    // Verificar o token com o Clerk
    const clerkSession = await clerk.verifyToken(token);
    
    if (!clerkSession) {
      return res.status(401).json({ error: 'Token inválido' });
    }

    // Obter os detalhes do usuário do Clerk
    const clerkUser = await clerk.users.getUser(clerkSession.sub);
    
    if (!clerkUser) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    // Verificar se o usuário já existe no EverShop
    const connection = await pool.connect();
    try {
      const existingCustomer = await select()
        .from('customer')
        .where('email', '=', clerkUser.emailAddresses[0].emailAddress)
        .load(connection);

      let customer;
      
      if (!existingCustomer) {
        // Criar um novo cliente no EverShop
        const customerId = uuidv4();
        
        customer = await insert('customer')
          .given({
            customer_id: customerId,
            uuid: customerId,
            status: 1,
            group_id: null,
            email: clerkUser.emailAddresses[0].emailAddress,
            password: null, // Não precisamos de senha com o Clerk
            full_name: `${clerkUser.firstName} ${clerkUser.lastName}`,
            created_at: new Date(),
            updated_at: new Date()
          })
          .execute(connection);
      } else {
        customer = existingCustomer;
      }

      // Criar uma sessão para o cliente no EverShop
      req.session.customerID = customer.uuid;

      // Retornar os dados do cliente
      return res.status(200).json({
        success: true,
        customer: {
          id: customer.uuid,
          email: customer.email,
          fullName: customer.full_name
        }
      });
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Erro na autenticação Clerk:', error);
    return res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Endpoint para registro
router.post('/api/clerk/register', async (req, res) => {
  try {
    const { token, firstName, lastName, email } = req.body;
    
    if (!token) {
      return res.status(400).json({ error: 'Token não fornecido' });
    }

    // Verificar o token com o Clerk
    const clerkSession = await clerk.verifyToken(token);
    
    if (!clerkSession) {
      return res.status(401).json({ error: 'Token inválido' });
    }

    // Criar um novo cliente no EverShop
    const connection = await pool.connect();
    try {
      // Verificar se o email já está em uso
      const existingCustomer = await select()
        .from('customer')
        .where('email', '=', email)
        .load(connection);

      if (existingCustomer) {
        return res.status(409).json({ error: 'Email já está em uso' });
      }

      // Criar um novo cliente
      const customerId = uuidv4();
      
      const customer = await insert('customer')
        .given({
          customer_id: customerId,
          uuid: customerId,
          status: 1,
          group_id: null,
          email: email,
          password: null, // Não precisamos de senha com o Clerk
          full_name: `${firstName} ${lastName}`,
          created_at: new Date(),
          updated_at: new Date()
        })
        .execute(connection);

      // Criar uma sessão para o cliente no EverShop
      req.session.customerID = customer.uuid;

      // Retornar os dados do cliente
      return res.status(200).json({
        success: true,
        customer: {
          id: customer.uuid,
          email: customer.email,
          fullName: customer.full_name
        }
      });
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Erro no registro Clerk:', error);
    return res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

module.exports = router;