import { registerLoginLog } from "../controllers/log";

const attempts = new Map(); 
const waitTime = 3 * 60 * 1000; // 3 minutes in milliseconds 
const maxFailures = 5; 

export async function loginLimit(req, res, next) {
    const now = Date.now();

    // Remover registros vencidos para não acumular IPs na memória 
    for(const [ip, attempts] of attempts) {
        if(attempt.expiresAt <= now())
            attempts.delete(ip);
    }
    
    const attempt = attempts.get(req.ip); 

    if(attempt?.failures >= maxFailures){
        const seconds = Math.ceil((attempt.expiresAt - now) / 1000);

        // Arredonda para cima; enquanto houver tempo restante, mostra ao menos 1 min 
        const minutes = Math.ceil(seconds / 60) || 1; 

        await registerLoginLog(req, 429, "Bloqueado")
        res.set('Retry-After', String(seconds)); 

        return res.status(429).json({
            message: "Limite de tentativas atingido. Aguarde " + minutes + " minuto(s) para tentar novamente."
        })
    }

    // Controller chama esta função depois de verificar as credenciais 
    res.local.recordLoginResult = sucess => {
        if(sucess){
            attempts.delete(req.ip);
        }

    const current = attempts.get(req.ip) || { failures: 0};
    
    current.failures+=1;

    // a quinta falha inicia um bloqueio de 3 minutos completos 
        current.expiresAt = Date.now() + waitTime;
        attempts.set(req.ip, current);
}

next();

}