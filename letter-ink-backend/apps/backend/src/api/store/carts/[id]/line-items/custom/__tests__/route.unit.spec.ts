import { POST } from "../route";
import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import { addToCartWorkflow } from "@medusajs/medusa/core-flows";

// Mock the core workflow
jest.mock("@medusajs/medusa/core-flows", () => ({
  addToCartWorkflow: jest.fn(),
}));

describe("POST /store/carts/:id/line-items/custom", () => {
  let mockReq: Partial<MedusaRequest>;
  let mockRes: Partial<MedusaResponse>;
  let mockRun: jest.Mock;

  beforeEach(() => {
    mockRun = jest.fn();
    (addToCartWorkflow as unknown as jest.Mock).mockReturnValue({
      run: mockRun,
    });

    mockReq = {
      params: { id: "cart_123" },
      body: {
        variant_id: "var_123",
        quantity: 2,
        unit_price: 1500,
        metadata: { custom_note: "Happy Birthday" },
      },
      scope: {} as any,
    };

    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should successfully add a custom line item to the cart", async () => {
    mockRun.mockResolvedValue({
      result: { id: "item_123", title: "Custom Item" },
    });

    await POST(mockReq as MedusaRequest, mockRes as MedusaResponse);

    expect(addToCartWorkflow).toHaveBeenCalledWith(mockReq.scope);
    expect(mockRun).toHaveBeenCalledWith({
      input: {
        cart_id: "cart_123",
        items: [
          {
            variant_id: "var_123",
            quantity: 2,
            unit_price: 1500,
            metadata: { custom_note: "Happy Birthday" },
          },
        ],
      },
    });

    expect(mockRes.status).toHaveBeenCalledWith(200);
    expect(mockRes.json).toHaveBeenCalledWith({
      success: true,
      result: { id: "item_123", title: "Custom Item" },
    });
  });

  it("should return a 400 status on failure", async () => {
    mockRun.mockRejectedValue(new Error("Cart not found"));

    await POST(mockReq as MedusaRequest, mockRes as MedusaResponse);

    expect(mockRes.status).toHaveBeenCalledWith(400);
    expect(mockRes.json).toHaveBeenCalledWith({
      success: false,
      error: "Cart not found",
    });
  });
});
