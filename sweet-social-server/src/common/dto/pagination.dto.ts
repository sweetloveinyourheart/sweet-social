import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IPaginationMeta } from "nestjs-typeorm-paginate";

class PaginationMetaDto implements IPaginationMeta {
    @ApiProperty()
    itemCount: number;

    @ApiPropertyOptional()
    totalItems?: number;

    @ApiPropertyOptional()
    itemsPerPage: number;

    @ApiPropertyOptional()
    totalPages?: number;

    @ApiPropertyOptional()
    currentPage: number;

}

export class PaginationDto<T> {
    @ApiProperty()
    items: T[];

    @ApiProperty()
    meta: PaginationMetaDto
}