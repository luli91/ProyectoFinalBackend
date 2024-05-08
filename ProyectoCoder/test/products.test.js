import supertest from 'supertest';
import app from '../src/app.js';

const requester = supertest(app);

describe('Product Routes', () => {
    let productId; //almacena el ID del producto creado
    const userId = 'id-del-usuario'; 

    const newProduct = { 
        title: 'Producto de prueba',
        description: 'Este es un producto de prueba',
        price: 100,
        thumbnail: 'url-de-la-imagen',
        code: 'codigo-de-prueba',
        stock: 10,
        category: 'categoria-de-prueba',
        owner: userId 
    };
    const updatedData = { 
        title: 'Producto de prueba actualizado',
        description: 'Este es un producto de prueba actualizado',
        price: 150,
        thumbnail: 'url-de-la-imagen-actualizada',
        code: 'codigo-de-prueba-actualizado',
        stock: 15,
        category: 'categoria-de-prueba-actualizada',
        owner: userId
    };

    beforeEach(async (done) => {
        // crea un nuevo producto antes de cada prueba
        requester
            .post('/')
            .send(newProduct)
            .expect(200) 
            .end((err, res) => {
                if (err) return done(err);
                productId = res.body._id; // guarda el ID del producto para usarlo en las siguientes pruebas
                done();
            });
    });

    it('should get a product by id', (done) => {
        requester
            .get(`/${productId}`)
            .expect(200) 
            .end((err, res) => {
                if (err) return done(err);
                done();
            });
    });

    it('should get all products', (done) => {
        requester
            .get('/products')
            .expect(200) 
            .end((err, res) => {
                if (err) return done(err);
                done();
            });
    });

    it('should create a new product', (done) => {
        requester
            .post('/')
            .send(newProduct)
            .expect(200) 
            .end((err, res) => {
                if (err) return done(err);
                done();
            });
    });

    it('should update a product', (done) => {
        requester
            .put(`/${productId}`)
            .send(updatedData)
            .expect(200) 
            .end((err, res) => {
                if (err) return done(err);
                done();
            });
    });

    it('should delete a product', (done) => {
        requester
            .delete(`/${productId}`)
            .expect(200) 
            .end((err, res) => {
                if (err) return done(err);
                done();
            });
    });

    afterEach(async (done) => {
        // elimina el producto despus de cada prueba
        requester
            .delete(`/${productId}`)
            .expect(200) 
            .end((err, res) => {
                if (err) return done(err);
                done();
            });
    });
});

//npx mocha ProyectoCoder/test/products.test.js
