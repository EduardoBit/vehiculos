package com.tienda.vehiculos.dto;

public class MensajeResponse {
    private String mensaje;
    private boolean exito;

    public MensajeResponse() {}

    public MensajeResponse(String mensaje) {
        this.mensaje = mensaje;
        this.exito = true;
    }

    public MensajeResponse(String mensaje, boolean exito) {
        this.mensaje = mensaje;
        this.exito = exito;
    }

    public String getMensaje() {
        return mensaje;
    }

    public void setMensaje(String mensaje) {
        this.mensaje = mensaje;
    }

    public boolean isExito() {
        return exito;
    }

    public void setExito(boolean exito) {
        this.exito = exito;
    }
}
