import Ticket from '../../models/ticket.model.js'


class TicketDao {
    async saveTicket(ticketData) {
        try {
            const newTicket = new Ticket(ticketData);
            await newTicket.save();
            return newTicket; 
        } catch (error) {
            console.error('Error al guardar el ticket:', error);
            throw error; 
        }
    }

    async getTicketById(ticketId) {
        try {
            const ticket = await Ticket.findById(ticketId);
            return ticket;
        } catch (error) {
            console.error('Error al obtener el ticket por ID:', error);
            throw error;
        }
    }

    async updateTicket(ticketId, updatedData) {
        try {
            const ticket = await Ticket.findByIdAndUpdate(ticketId, updatedData, { new: true });
            return ticket;
        } catch (error) {
            console.error('Error al actualizar el ticket:', error);
            throw error;
        }
    }

    async deleteTicket(ticketId) {
        try {
            const deletedTicket = await Ticket.findByIdAndDelete(ticketId);
            return deletedTicket;
        } catch (error) {
            console.error('Error al eliminar el ticket:', error);
            throw error;
        }
    }
    
    async getAllTickets() {
        try {
            const tickets = await Ticket.find();
            return tickets;
        } catch (error) {
            console.error('Error al obtener todos los tickets:', error);
            throw error;
        }
    }
    
}

export default new TicketDao();