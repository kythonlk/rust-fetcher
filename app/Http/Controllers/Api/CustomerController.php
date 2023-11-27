<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Shop\Customer;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CustomerController extends Controller
{
    /**
     * Display a listing of the customers.
     *
     * @return JsonResponse
     */
    public function index(): JsonResponse
    {
        $customers = Customer::all();

        return response()->json(['customers' => $customers]);
    }

    /**
     * Store a newly created customer in storage.
     *
     * @param  Request  $request
     * @return JsonResponse
     */
    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'name' => 'required|max:50',
            'email' => 'required|email|unique:customers,email',
            'phone' => 'max:50',
            'birthday' => 'date',
            // Add validation rules for other fields if needed
        ]);

        $customer = Customer::create($data);

        return response()->json(['customer' => $customer], 201);
    }

    // You can add other methods (e.g., show, update, destroy) as needed.
}
