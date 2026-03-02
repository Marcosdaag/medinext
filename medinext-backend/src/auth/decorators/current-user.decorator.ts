import { createParamDecorator, ExecutionContext } from '@nestjs/common';

/**
 * Extrae la propiedad `user` del request y, opcionalmente, una subclave.
 *
 * Uso:
 *   @CurrentUser() user           -> devuelve objeto completo
 *   @CurrentUser('userId') userId -> devuelve solo user.userId
 */
export const CurrentUser = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest();
    const user = req.user;
    return data ? user?.[data] : user;
  },
);
