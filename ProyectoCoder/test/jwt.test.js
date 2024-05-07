import supertest from 'supertest';
import app from '../src/app.js'; 
import { expect } from 'chai';

const requester = supertest.agent(app);

describe('Auth Routes', function() {
    this.timeout(5000); // 5 segundos

    let token; // Para almacenar el token de autenticación
    let userId; // Para almacenar el ID del usuario

    before(async () => {
        // Crea un usuario de prueba y obtiene su token de autenticación
        const user = { 
            first_name: 'Test',
            last_name: 'User',
            email: 'testuser@example.com',
            password: 'testpassword',
            age: 30,
            role: 'user'
        };

        let res = await requester.post('/api/register').send(user);
        userId = res.body._id;

        expect(res.statusCode).to.equal(200);

        const credentials = { 
            email: 'testuser@example.com',
            password: 'testpassword' 
        };
        res = await requester.post('/api/login').send(credentials);
        expect(res.statusCode).to.equal(200);
        token = res.body.token; // Guarda el token para usarlo en las pruebas
    });

    it('should log in a user', async () => {
        const res = await requester.post('/api/login')
            .send({
                email: 'testuser@example.com',
                password: 'testpassword',
            });

        expect(res.statusCode).to.equal(200);
        expect(res).to.have.cookie('jwtCookieToken');
    });

    it('should log out a user', async () => {
        const res = await requester.get('/api/logout')
            .set('Authorization', `Bearer ${token}`); // Añade el token de autenticación a la solicitud

        expect(res.statusCode).to.equal(200);
        expect(res.body).to.have.property('message', 'Logout success!!');
    });

    after(async () => {
        // Elimina el usuario de prueba después de todas las pruebas
        const res = await requester.delete(`/api/users/${userId}`).set('Authorization', `Bearer ${token}`);
        expect(res.statusCode).to.equal(200);

        // Cierra el servidor y la conexión a la base de datos
        await new Promise(resolve => app.close(resolve));
    });
});
// npx mocha ProyectoCoder/test/jwt.test.js