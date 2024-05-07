import { expect } from 'chai';
import supertest from 'supertest';
import app from '../src/app.js'; 


const requester = supertest(app);

describe('Cart Routes', () => {

    let cartId; // almacena el ID del carrito creado
    let token; // almacena el token de autenticación del usuario

    let userId; // almacena el ID del usuario de prueba

    before(async () => {
        // crea un usuario de prueba y obtiene su token de autenticación
        const user = { 
            name: 'Test User',
            email: 'testuser@example.com',
            password: 'testpassword' };
            
        let res = await requester.post('/users').send(user);
        expect(res.statusCode).to.equal(200);
        userId = res.body._id; // guarda el ID del usuario para usarlo en las pruebas

        const credentials = { 
            email: 'testuser@example.com',
            password: 'testpassword' };
        res = await requester.post('/login').send(credentials);
        expect(res.statusCode).to.equal(200);
        token = res.body.token; // guarda el token para usarlo en las pruebas
    });

    beforeEach(async () => {
        // crea un nuevo carrito antes de cada prueba
        const res = await requester.post('/cart').set('Authorization', `Bearer ${token}`);
        expect(res.statusCode).to.equal(200);
        cartId = res.body._id; // guarda el ID del carrito para usarlo en las siguientes pruebas
    });


    it('should create a new cart', async () => {
        const res = await requester.post('/cart').set('Authorization', `Bearer ${token}`);
        expect(res.statusCode).to.equal(200);
        expect(res.body).to.have.property('_id');
        
    });

    it('should get a cart by id', async () => {
        const res = await requester.get(`/cart/${cartId}`);
        expect(res.statusCode).to.equal(200);
        expect(res.body).to.have.property('_id').equal(cartId);
    });

    it('should update a cart', async () => {
        const updateData = { 
            productId: 'id_del_producto',
            quantity: 2 };
        const res = await requester.put(`/cart/${cartId}`).send(updateData);
        expect(res.statusCode).to.equal(200);
        
    });

    it('should add a product to the cart', async () => {

        const productId = 'id_del_producto';

        const res = await requester.post(`/cart/${cartId}/products/${productId}`);
        expect(res.statusCode).to.equal(200);
        
    });

    it('should remove a product from the cart', async () => {
        
        const productId = 'id_del_producto'; 

        const res = await requester.delete(`/cart/${cartId}/products/${productId}`);
        expect(res.statusCode).to.equal(200);
        
    });

    it('should delete a cart', async () => {

        const res = await requester.delete(`/cart/${cartId}`);
        expect(res.statusCode).to.equal(200);
        
    });

    it('should purchase a cart', async () => {
        
        const res = await requester.post(`/cart/${cartId}/purchase`);
        expect(res.statusCode).to.equal(200);
        
    });

    it('should get a cart by user id', async () => {
        
        const res = await requester.get(`/cart/${userId}`);
        expect(res.statusCode).to.equal(200);
        
    });

    afterEach(async () => {
        // elimina el carrito despues de cada prueba
        const res = await requester.delete(`/cart/${cartId}`).set('Authorization', `Bearer ${token}`);
        expect(res.statusCode).to.equal(200);
    });

    after(async () => {
    // elimina el usuario de prueba despues de todas las pruebas
    const res = await requester.delete(`/users/${userId}`).set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).to.equal(200);
    });
});

//npx mocha ProyectoCoder/test/cart.test.js
