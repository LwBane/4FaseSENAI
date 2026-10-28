export async function registerLog(connection, event) {
    
    const sql = "INSERT INTO logs (usuario,acao, mensagem, recurso_afetado, id_recurso_afetado, valor_antigo, valor_novo, campos_alterados, ip, codigo_http, status_acao) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

    const [result] = await connection.execute(sql, [
        event.usuario,
        event.acao,
        event.mensagem,
        event.recurso_afetado,
        event.id_recurso_afetado,
        event.valor_antigo,
        event.valor_novo,
        event.campos_alterados,
        event.ip,
        event.codigo_http,
        event.status_acao
    ]);

}

export async function listLog(req, res) {
    const sql = "SELECT l.id as id_log, l.usuario as usuario_log, u.name as usuario_name, l.datahora as data_hora, l.acao as acao, l.mensagem as mensagem, l.recurso_afetado, id_recurso_afetado, valor_antigo, valor_novo, campos_alterados, ip, status_acao FROM logs as l LEFT JOIN users as u ON u.id = l.usuario ORDER BY l.data_hora DESC";
    const [rows] = await connection.execute(sql);
    res.json(rows);
}

export async function registerLoginLog(req, status, userId = null) {

    const email = typeof req.body.email === 'string' ? req.body.email.trim().toLowerCase().slice(0,254) : "Não informado";

    await registerLog(req.app.locals.db, {
        usuario: userId,
        acao: "login",
        mensagem: "Tentativa de login:" + email + ", Resultado: " + status, 
        recurso_afetado: "users",
        id_recurso_afetado: userId === null ? null : String(userId), 
        valor_antigo: null,
        valor_novo: null,
        campos_alterados: null, 
        ip: req.ip, 
        status_acao: status 
    })
}



