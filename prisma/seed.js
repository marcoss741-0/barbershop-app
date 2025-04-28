"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var client_1 = require("@prisma/client");
var prisma = new client_1.PrismaClient();
function seedDatabase() {
    return __awaiter(this, void 0, void 0, function () {
        var images, creativeNames, addresses, services, users, barbershops, i, name_1, address, imageUrl, user, barbershop, _i, services_1, service, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 10, , 11]);
                    images = [
                        "https://utfs.io/f/c97a2dc9-cf62-468b-a851-bfd2bdde775f-16p.png",
                        "https://utfs.io/f/45331760-899c-4b4b-910e-e00babb6ed81-16q.png",
                        "https://utfs.io/f/5832df58-cfd7-4b3f-b102-42b7e150ced2-16r.png",
                        "https://utfs.io/f/7e309eaa-d722-465b-b8b6-76217404a3d3-16s.png",
                        "https://utfs.io/f/178da6b6-6f9a-424a-be9d-a2feb476eb36-16t.png",
                        "https://utfs.io/f/2f9278ba-3975-4026-af46-64af78864494-16u.png",
                        "https://utfs.io/f/988646ea-dcb6-4f47-8a03-8d4586b7bc21-16v.png",
                        "https://utfs.io/f/60f24f5c-9ed3-40ba-8c92-0cd1dcd043f9-16w.png",
                        "https://utfs.io/f/f64f1bd4-59ce-4ee3-972d-2399937eeafc-16x.png",
                        "https://utfs.io/f/e995db6d-df96-4658-99f5-11132fd931e1-17j.png",
                        "https://utfs.io/f/3bcf33fc-988a-462b-8b98-b811ee2bbd71-17k.png",
                        "https://utfs.io/f/5788be0e-2307-4bb4-b603-d9dd237950a2-17l.png",
                        "https://utfs.io/f/6b0888f8-b69f-4be7-a13b-52d1c0c9cab2-17m.png",
                        "https://utfs.io/f/ef45effa-415e-416d-8c4a-3221923cd10f-17n.png",
                        "https://utfs.io/f/ef45effa-415e-416d-8c4a-3221923cd10f-17n.png",
                        "https://utfs.io/f/a55f0f39-31a0-4819-8796-538d68cc2a0f-17o.png",
                        "https://utfs.io/f/5c89f046-80cd-4443-89df-211de62b7c2a-17p.png",
                        "https://utfs.io/f/23d9c4f7-8bdb-40e1-99a5-f42271b7404a-17q.png",
                        "https://utfs.io/f/9f0847c2-d0b8-4738-a673-34ac2b9506ec-17r.png",
                        "https://utfs.io/f/07842cfb-7b30-4fdc-accc-719618dfa1f2-17s.png",
                        "https://utfs.io/f/0522fdaf-0357-4213-8f52-1d83c3dcb6cd-18e.png",
                    ];
                    creativeNames = [
                        "Barbearia Vintage",
                        "Corte & Estilo",
                        "Barba & Navalha",
                        "The Dapper Den",
                        "Cabelo & Cia.",
                        "Machado & Tesoura",
                        "Barbearia Elegance",
                        "Aparência Impecável",
                        "Estilo Urbano",
                        "Estilo Clássico",
                    ];
                    addresses = [
                        "Rua da Barbearia, 123",
                        "Avenida dos Cortes, 456",
                        "Praça da Barba, 789",
                        "Travessa da Navalha, 101",
                        "Alameda dos Estilos, 202",
                        "Estrada do Machado, 303",
                        "Avenida Elegante, 404",
                        "Praça da Aparência, 505",
                        "Rua Urbana, 606",
                        "Avenida Clássica, 707",
                    ];
                    services = [
                        {
                            name: "Corte de Cabelo",
                            description: "Estilo personalizado com as últimas tendências.",
                            price: 60.0,
                            imageUrl: "https://utfs.io/f/0ddfbd26-a424-43a0-aaf3-c3f1dc6be6d1-1kgxo7.png",
                        },
                        {
                            name: "Barba",
                            description: "Modelagem completa para destacar sua masculinidade.",
                            price: 40.0,
                            imageUrl: "https://utfs.io/f/e6bdffb6-24a9-455b-aba3-903c2c2b5bde-1jo6tu.png",
                        },
                        {
                            name: "Pézinho",
                            description: "Acabamento perfeito para um visual renovado.",
                            price: 35.0,
                            imageUrl: "https://utfs.io/f/8a457cda-f768-411d-a737-cdb23ca6b9b5-b3pegf.png",
                        },
                        {
                            name: "Sobrancelha",
                            description: "Expressão acentuada com modelagem precisa.",
                            price: 20.0,
                            imageUrl: "https://utfs.io/f/2118f76e-89e4-43e6-87c9-8f157500c333-b0ps0b.png",
                        },
                        {
                            name: "Massagem",
                            description: "Relaxe com uma massagem revigorante.",
                            price: 50.0,
                            imageUrl: "https://utfs.io/f/c4919193-a675-4c47-9f21-ebd86d1c8e6a-4oen2a.png",
                        },
                        {
                            name: "Hidratação",
                            description: "Hidratação profunda para cabelo e barba.",
                            price: 25.0,
                            imageUrl: "https://utfs.io/f/8a457cda-f768-411d-a737-cdb23ca6b9b5-b3pegf.png",
                        },
                    ];
                    users = [
                        { name: "Marcos Martins", email: "teste@gmail.com" },
                        { name: "Matheus Martins", email: "teste2@gmail.com" },
                        { name: "Arthur Rodrigues", email: "teste3@gmail.com" },
                        { name: "Felipe Martins", email: "teste4@gmail.com" },
                        { name: "Richard Grady", email: "teste5@gmail.com" },
                        { name: "Thiado Silva", email: "teste6@gmail.com" },
                        { name: "Fred Guedes", email: "teste7@gmail.com" },
                        { name: "Bernard Gouveia", email: "teste8@gmail.com" },
                        { name: "Fausto Vera", email: "teste9@gmail.com" },
                        { name: "Allan Franco", email: "teste10@gmail.com" },
                    ];
                    barbershops = [];
                    i = 0;
                    _a.label = 1;
                case 1:
                    if (!(i < 10)) return [3 /*break*/, 8];
                    name_1 = creativeNames[i];
                    address = addresses[i];
                    imageUrl = images[i];
                    user = users[i % users.length];
                    return [4 /*yield*/, prisma.barbershop.create({
                            data: {
                                name: name_1,
                                address: address,
                                imageUrl: imageUrl,
                                phones: ["(11) 99999-9999", "(11) 99999-9999"],
                                description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec ac augue ullamcorper, pharetra orci mollis, auctor tellus. Phasellus pharetra erat ac libero efficitur tempus. Donec pretium convallis iaculis. Etiam eu felis sollicitudin, cursus mi vitae, iaculis magna. Nam non erat neque. In hac habitasse platea dictumst. Pellentesque molestie accumsan tellus id laoreet.",
                                user: {
                                    connectOrCreate: {
                                        where: { email: user.email }, // Verifica se o usuário já existe pelo email
                                        create: {
                                            name: user.name,
                                            email: user.email,
                                        },
                                    },
                                },
                            },
                        })];
                case 2:
                    barbershop = _a.sent();
                    _i = 0, services_1 = services;
                    _a.label = 3;
                case 3:
                    if (!(_i < services_1.length)) return [3 /*break*/, 6];
                    service = services_1[_i];
                    return [4 /*yield*/, prisma.barbershopService.create({
                            data: {
                                name: service.name,
                                description: service.description,
                                price: service.price,
                                barbershop: {
                                    connect: {
                                        id: barbershop.id,
                                    },
                                },
                                imageUrl: service.imageUrl,
                            },
                        })];
                case 4:
                    _a.sent();
                    _a.label = 5;
                case 5:
                    _i++;
                    return [3 /*break*/, 3];
                case 6:
                    barbershops.push(barbershop);
                    _a.label = 7;
                case 7:
                    i++;
                    return [3 /*break*/, 1];
                case 8: 
                // Fechar a conexão com o banco de dados
                return [4 /*yield*/, prisma.$disconnect()];
                case 9:
                    // Fechar a conexão com o banco de dados
                    _a.sent();
                    return [3 /*break*/, 11];
                case 10:
                    error_1 = _a.sent();
                    console.error("Erro ao criar as barbearias:", error_1);
                    return [3 /*break*/, 11];
                case 11: return [2 /*return*/];
            }
        });
    });
}
seedDatabase();
