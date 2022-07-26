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
exports.Producto = void 0;
const typegoose_1 = require("@typegoose/typegoose");
class img {
}
__decorate([
    (0, typegoose_1.prop)({ type: () => String }),
    __metadata("design:type", String)
], img.prototype, "name", void 0);
class Producto {
}
__decorate([
    (0, typegoose_1.prop)({ type: String, required: true, trim: true }),
    __metadata("design:type", String)
], Producto.prototype, "name", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: String, required: true }),
    __metadata("design:type", String)
], Producto.prototype, "description", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: Number, default: 0 }),
    __metadata("design:type", Number)
], Producto.prototype, "precio", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: Number, default: 0 }),
    __metadata("design:type", Number)
], Producto.prototype, "preciodeventa", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: String, required: true }),
    __metadata("design:type", String)
], Producto.prototype, "folderfile", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: () => [String] }),
    __metadata("design:type", Array)
], Producto.prototype, "imgProducto", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: Number }),
    __metadata("design:type", Number)
], Producto.prototype, "utilidad", void 0);
exports.Producto = Producto;
const ProductoModel = (0, typegoose_1.getModelForClass)(Producto);
exports.default = ProductoModel;
