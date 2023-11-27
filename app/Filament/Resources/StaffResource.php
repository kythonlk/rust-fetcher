<?php

namespace App\Filament\Resources;

use App\Filament\Resources\StaffResource\Pages;
use App\Filament\Resources\StaffResource\RelationManagers;
use App\Models\Staff;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletingScope;

class StaffResource extends Resource
{
    protected static ?string $model = Staff::class;

    protected static ?string $navigationIcon = 'heroicon-o-rectangle-stack';

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\TextInput::make('name')
                ->required()
                ->maxLength(255),
                Forms\Components\Select::make('position')
                ->options([
                    'maneger' => 'Maneger',
                    'customer_service' => 'Customer Service',
                    'admin' => 'Admin',
                ]),
                Forms\Components\TextInput::make('email')
                ->email()
                ->required()
                ->maxLength(255),
                // Forms\Components\TextInput::make('password')
                // ->password()
                // ->required()
                // ->maxLength(255),
                Forms\Components\RichEditor::make('bio')
                ->required()
                ->maxLength(255),
                Forms\Components\FileUpload::make('photo')
                ->directory('staff')
                ->visibility('private'),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('name')
                ->searchable(),
                Tables\Columns\TextColumn::make('email')
                ->searchable(),
                Tables\Columns\TextColumn::make('position')
                ->sortable(),
                // Tables\Columns\TextColumn::make('password'),
                Tables\Columns\TextColumn::make('photo'),
            ])
            ->filters([
                Tables\Filters\SelectFilter::make('position')
                ->options([
                    'maneger' => 'Maneger',
                    'customer_service' => 'Customer Service',
                    'admin' => 'Admin',
                ]),
            ])
            ->actions([
                Tables\Actions\EditAction::make(),
            ])
            ->bulkActions([
                Tables\Actions\BulkActionGroup::make([
                    Tables\Actions\DeleteBulkAction::make(),
                ]),
            ]);
    }
    
    public static function getRelations(): array
    {
        return [
            //
        ];
    }
    
    public static function getPages(): array
    {
        return [
            'index' => Pages\ListStaff::route('/'),
            'create' => Pages\CreateStaff::route('/create'),
            'edit' => Pages\EditStaff::route('/{record}/edit'),
        ];
    }    
}
