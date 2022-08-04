"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Venta = void 0;
const typegoose_1 = require("@typegoose/typegoose");
class Detalles {
}
__decorate([
    (0, typegoose_1.prop)({ type: () => Number }),
    __metadata("design:type", Number)
], Detalles.prototype, "Total", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: () => Number }),
    __metadata("design:type", Number)
], Detalles.prototype, "articulosTotal", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: () => Number }),
    __metadata("design:type", Number)
], Detalles.prototype, "cambio", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: () => Number }),
    __metadata("design:type", Number)
], Detalles.prototype, "importe", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: () => String }),
    __metadata("design:type", String)
], Detalles.prototype, "username", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: () => Date, default: Date.now }),
    __metadata("design:type", String)
], Detalles.prototype, "fechaVenta", void 0);
class Productos {
}
__decorate([
    (0, typegoose_1.prop)({ type: () => String }),
    __metadata("design:type", String)
], Productos.prototype, "name", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: () => String }),
    __metadata("design:type", String)
], Productos.prototype, "precio", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: () => String }),
    __metadata("design:type", String)
], Productos.prototype, "preciodeventa", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: () => Number }),
    __metadata("design:type", Number)
], Productos.prototype, "cantidad", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: () => Number }),
    __metadata("design:type", Number)
], Productos.prototype, "utilidad", void 0);
class Venta {
}
__decorate([
    (0, typegoose_1.prop)({ type: () => Detalles, _id: false }),
    __metadata("design:type", Detalles)
], Venta.prototype, "detalles", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: () => [Productos], _id: false }),
    __metadata("design:type", Array)
], Venta.prototype, "productos", void 0);
exports.Venta = Venta;
const ventaModel = (0, typegoose_1.getModelForClass)(Venta);
exports.default = ventaModel;
