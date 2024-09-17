import { UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { JwtAuthGuard, RolesGuard } from '../features/auth';

@UseGuards(JwtAuthGuard, RolesGuard)
@ApiUnauthorizedResponse({ description: 'Unauthorized' })
@ApiBearerAuth()
export class BaseController {}
