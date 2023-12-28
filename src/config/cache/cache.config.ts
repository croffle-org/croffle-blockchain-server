import { CacheModuleOptions, CacheOptionsFactory, Injectable } from '@nestjs/common';

@Injectable()
export class CacheConfig implements CacheOptionsFactory {
    createCacheOptions(): CacheModuleOptions<Record<string, any>> | Promise<CacheModuleOptions<Record<string, any>>> {
        return {
            isGlobal: true,
            max: 10,
            ttl: 0,
        };
    }
}
